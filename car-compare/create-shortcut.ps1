$ws = New-Object -ComObject WScript.Shell
$shortcut = $ws.CreateShortcut("C:\Users\Cjohannsen\Desktop\CarCompare.lnk")
$shortcut.TargetPath = "x:\Comp405\New folder\car-compare\launch.bat"
$shortcut.WorkingDirectory = "x:\Comp405\New folder\car-compare"
$shortcut.IconLocation = "x:\Comp405\New folder\car-compare\CarCompare.ico,0"
$shortcut.Description = "Launch CarCompare App"
$shortcut.WindowStyle = 7
$shortcut.Save()
Write-Host "Desktop shortcut created!"
