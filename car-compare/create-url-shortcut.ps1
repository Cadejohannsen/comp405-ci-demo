# Create a URL shortcut as backup
$shell = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$urlShortcut = $shell.CreateShortcut("$desktop\CarCompare.url")
$urlShortcut.TargetPath = "http://localhost:3000"
$urlShortcut.Save()
Write-Host "URL shortcut created as backup!"
