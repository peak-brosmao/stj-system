$ErrorActionPreference = "Stop"

$backendPath = (Resolve-Path (Join-Path $PSScriptRoot "..\backend")).Path
$outputZip = Join-Path $PSScriptRoot "..\backend-deploy.zip"
$tempPath = Join-Path $env:TEMP "stj-backend-deploy"

if (-not (Test-Path -LiteralPath $backendPath)) {
    throw "Backend folder was not found: $backendPath"
}

foreach ($path in @($tempPath, $outputZip)) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

New-Item -ItemType Directory -Path $tempPath | Out-Null

Get-ChildItem -LiteralPath $backendPath -Recurse -File |
    Where-Object {
        $relative = $_.FullName.Substring($backendPath.Length + 1)
        $parts = $relative -split "[\\/]"
        ($parts -notcontains "vendor") -and
        ($parts -notcontains "node_modules") -and
        ($parts -notcontains ".git") -and
        ($parts -notcontains "logs") -and
        ($parts -notcontains "cache") -and
        ($_.Name -ne ".env") -and
        ($_.Extension -notin @(".db", ".sqlite", ".zip"))
    } |
    ForEach-Object {
        $relative = $_.FullName.Substring($backendPath.Length + 1)
        $destination = Join-Path $tempPath $relative
        $parent = Split-Path $destination -Parent
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
        Copy-Item -LiteralPath $_.FullName -Destination $destination -Force
    }

Compress-Archive -Path (Join-Path $tempPath "*") -DestinationPath $outputZip -Force
Remove-Item -LiteralPath $tempPath -Recurse -Force

Write-Host "Created backend deployment archive: $outputZip"
