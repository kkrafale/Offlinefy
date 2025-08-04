require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const SpotifyWebApi = require('spotify-web-api-node');
const ytSearch = require('yt-search');
const readline = require('readline');

const OUTPUT_DIR = path.join(__dirname, '..', 'Output');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

function centerText(text) {
  const lines = text.split('\n');
  const width = process.stdout.columns || 80; 

  return lines
    .map(line => {
      const lineLength = line.replace(/\x1b\[[0-9;]*m/g, '').length; 
      if (lineLength >= width) return line;
      const spaces = Math.floor((width - lineLength) / 2);
      return ' '.repeat(spaces) + line;
    })
    .join('\n');
}

const greenStart = '\x1b[92m';
const greenEnd = '\x1b[0m';

const mainPageRaw = `
   ____   __  __ _ _             __       
  / __ \\ / _|/ _| (_)           / _|      
 | |  | | |_| |_| |_ _ __   ___| |_ _   _ 
 | |  | |  _|  _| | | '_ \\ / _ \\  _| | | |
 | |__| | | | | | | | | | |  __/ | | |_| |
  \\____/|_| |_| |_|_|_| |_|\\___|_|  \\__, |
                                     __/ |
                                    |___/ v1.2
-------- Playlist to .mp3 downloader--------
This project was created for educational purposes.
We are not affiliated with any enterprises or software.
This program must NOT be used to infringe copyright laws or violate the terms of use.
--------------------------------------------------
Paste your public playlist now
--------------------------------------------------

:_ `;

const mainPage = centerText(greenStart + mainPageRaw + greenEnd);

console.log(mainPage);


function sanitize(name) {
  return name.replace(/[<>:"\/\\|?*]+/g, '');
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAllTracks(playlistId) {
  let allTracks = [];
  let offset = 0;
  const limit = 100;
  let total = 1;

  while (offset < total) {
    const data = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
    const items = data.body.items;
    total = data.body.total;
    offset += items.length;

    const tracks = items
      .filter(item => item.track && item.track.name)
      .map(item => ({
        title: item.track.name,
        artist: item.track.artists.map(a => a.name).join(', ')
      }));

    allTracks.push(...tracks);
  }

  return allTracks;
}

function renderStatus(track, status, currentIndex, total) {
  const barLength = 30;
  const progress = currentIndex / total;
  const filledLength = Math.round(barLength * progress);
  const emptyLength = barLength - filledLength;

  const brightGreen = '\x1b[92m';
  const darkGreen = '\x1b[32m';
  const reset = '\x1b[0m';

  const bar =
    brightGreen + '█'.repeat(filledLength) + reset +
    darkGreen + '▒'.repeat(emptyLength) + reset;

  const percent = Math.round(progress * 100);


  process.stdout.write('\x1Bc');

  console.log('Now working:');
  console.log(`${track.title} - ${track.artist}\n`);
  console.log('Status:');
  console.log(status + '\n');
  console.log('Main progress:');
  console.log(`${bar} ${percent}%`);
}

async function downloadPlaylist(link) {
  try {
    const regex = /playlist\/([a-zA-Z0-9]+)\??/;
    const match = link.match(regex);
    if (!match) {
      console.error("Invalid playlist link.");
      process.exit(1);
    }

    const playlistId = match[1];

    renderStatus({title:'Nothing', artist:'Nothing'}, 'Loading', 0, 1);
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);

    const tracks = await getAllTracks(playlistId);
    const total = tracks.length;

    for (let i = 0; i < total; i++) {
      const track = tracks[i];

      renderStatus(track, 'Loading', i, total);
      const query = `${track.title} - ${track.artist}`;
      const r = await ytSearch(query);
      const video = r.videos[0];
      if (!video) {
        renderStatus(track, 'Not found, skipping...', i, total);
        await wait(1500);
        continue;
      }

      const sanitizedName = sanitize(`${track.title}.mp3`);
      const outputPath = path.join(OUTPUT_DIR, sanitizedName);
      if (fs.existsSync(outputPath)) {
        renderStatus(track, 'Already downloaded.', i + 1, total);
        await wait(1500);
        continue;
      }

      renderStatus(track, 'Downloading...', i + 1, total);
      await new Promise((resolve) => {
        const ytdlpPath = path.join(__dirname, 'yt-dlp.exe');
        const ffmpegPath = path.join(__dirname, 'ffmpeg.exe');

        const args = [
          video.url,
          '-x',
          '--audio-format', 'mp3',
          '--ffmpeg-location', ffmpegPath,
          '-o', outputPath
        ];

        execFile(ytdlpPath, args, (error) => {
          if (error) {
            renderStatus(track, `Failed to download: ${error.message}`, i + 1, total);
          } else {
            renderStatus(track, 'Saved.', i + 1, total);
          }
          resolve();
        });
      });

      await wait(1500);
    }

    renderStatus({title:'N/A', artist:'N/A'}, 'All tracks downloaded.', total, total);
    console.log('\n Finished downloading all tracks. You can find them on /Output');
  } catch (err) {
    console.error('An error ocurred:', err);
  }
}

console.clear();
process.stdout.write(mainPage);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('', (playlistLink) => {
  rl.close();
  downloadPlaylist(playlistLink.trim());
});