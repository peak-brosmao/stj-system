# =============================================================
# zip-backend.ps1 — Safe Backend Zip for Hostinger Upload
# 
# បង្កើត ZIP file សម្រាប់ upload ទៅ datastj.peakbrosmao.me
# ⚠️  ការពារ: exclude *.db files ដើម្បីជៀសវាង data reset
# =============================================================
# Usage: .\scripts\zip-backend.ps1
# =============================================================

$BackendPath = "$PSScriptRoot\..\backend"
$OutputZip   = "$PSScriptRoot\..\backend-deploy.zip"

# Exclude patterns — files/folders ដែលមិនត្រូវ upload
$ExcludePatterns = @(
    "*.db",
    "*.db-journal",
    "*.db-shm",
    "*.db-wal",
    "*.sqlite",
    ".env",           # server .env — save already on server
    "vendor",         # too large; run composer install on server
    "node_modules",
    ".git",
    "storage/logs/*", # server logs
    "storage/framework/cache/*"
)

Write-Host ""
Write-Host "🚀 STJ Backend — Safe Zip Builder" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📂 Source  : $BackendPath"
Write-Host "📦 Output  : $OutputZip"
Write-Host ""
Write-Host "⚠️  Excluding (ការពារ data):" -ForegroundColor Yellow
$ExcludePatterns | ForEach-Object { Write-Host "   ❌ $_" -ForegroundColor Red }
Write-Host ""

# Remove old zip if exists
if (Test-Path $OutputZip) {
    Remove-Item $OutputZip -Force
    Write-Host "🗑️  Removed old zip." -ForegroundColor Gray
}

# Build exclusion filter
$ExcludeFilter = $ExcludePatterns | ForEach-Object { [System.IO.Path]::Combine($BackendPath, $_) }

# Get all files, excluding patterns
$FilesToZip = Get-ChildItem -Path $BackendPath -Recurse -File | Where-Object {
    $file = $_.FullName
    $shouldExclude = $false

    foreach ($pattern in $ExcludePatterns) {
        # Match by extension
        if ($pattern -like "*.*" -and $pattern.StartsWith("*")) {
            $ext = $pattern.TrimStart("*")
            if ($file.EndsWith($ext)) {
                $shouldExclude = $true
                break
            }
        }
        # Match by folder name in path
        elseif (-not $pattern.Contains(".") -and -not $pattern.Contains("/")) {
            if ($file -match [regex]::Escape("\$pattern\")) {
                $shouldExclude = $true
                break
            }
        }
    }
    -not $shouldExclude
}

$Count = ($FilesToZip | Measure-Object).Count
Write-Host "📄 Files to zip: $Count" -ForegroundColor Green

# Create zip using Compress-Archive
$TempFolder = "$env:TEMP\stj-backend-temp"
if (Test-Path $TempFolder) { Remove-Item $TempFolder -Recurse -Force }
New-Item -ItemType Directory -Path $TempFolder | Out-Null

$FilesToZip | ForEach-Object {
    $RelPath = $_.FullName.Substring($BackendPath.Length + 1)
    $Dest    = Join-Path $TempFolder $RelPath
    $DestDir = Split-Path $Dest -Parent
    if (-not (Test-Path $DestDir)) {
        New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
    }
    Copy-Item $_.FullName $Dest -Force
}

Compress-Archive -Path "$TempFolder\*" -DestinationPath $OutputZip -Force
Remove-Item $TempFolder -Recurse -Force

Write-Host ""
Write-Host "✅ Done! Zip created: backend-deploy.zip" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Upload 'backend-deploy.zip' ទៅ Hostinger File Manager"
Write-Host "   2. Extract ទៅ datastj.peakbrosmao.me folder"
Write-Host "   3. ⚠️  stj.db នៅ server នឹងមិនត្រូវបាន overwrite!"
Write-Host ""

