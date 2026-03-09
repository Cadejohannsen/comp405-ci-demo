$shell = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$urlShortcut = $shell.CreateShortcut("$desktop\CarCompare.url")
$urlShortcut.TargetPath = "http://localhost:4200"
$urlShortcut.Save()
Write-Host "URL shortcut updated to port 4200!"
