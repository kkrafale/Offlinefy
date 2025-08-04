MsgBox "You need Node.js to use Offlinefy, which you don't have. When you click OK, you'll be redirected to install node.js.", vbCritical, "Offlinefy - Error"
Set shell = CreateObject("WScript.Shell")
shell.Run "https://nodejs.org/en/download", 1, false
