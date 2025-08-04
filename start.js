const { exec } = require('child_process');

const banner = `
 ___  __    ___  __    ________     
|\\  \\|\\  \\ |\\  \\|\\  \\ |\\   __  \\    
\\ \\  \\/  /|\\ \\  \\/  /|\\ \\  \\|\\  \\   
 \\ \\   ___  \\ \\   ___  \\ \\   _  _\\  
  \\ \\  \\\\ \\  \\ \\  \\\\ \\  \\ \\  \\\\  \\| 
   \\ \\__\\\\ \\__\\ \\__\\\\ \\__\\ \\__\\\\ _\\ 
    \\|__| \\|__|\\|__| \\|__|\\|__|\\|__|
                                    
________MADE BY: KKRAFALE___________
____https://github.com/kkrafale/____
`;

console.clear();
console.log(banner);

setTimeout(() => {
  exec('framesecond.bat', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing framesecond.bat: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
  });
}, 3000);
