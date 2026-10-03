Add-Type -AssemblyName System.Drawing

function Remove-Black([string]$inPath, [string]$outPath, [int]$thresh) {
    $src = [System.Drawing.Bitmap]::FromFile($inPath)
    $w = $src.Width
    $h = $src.Height
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    
    # Lock bits for high speed processing
    $srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $dest = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $destData = $dest.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    
    $bytes = [Math]::Abs($srcData.Stride) * $h
    $rgbValues = New-Object byte[] $bytes
    [System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $rgbValues, 0, $bytes)
    
    for ($i = 0; $i -lt $bytes; $i += 4) {
        $b = $rgbValues[$i]
        $g = $rgbValues[$i+1]
        $r = $rgbValues[$i+2]
        
        $max = [Math]::Max($r, [Math]::Max($g, $b))
        
        if ($max -le $thresh) {
            $rgbValues[$i+3] = 0 # Transparent
        } else {
            if ($max -lt 70) {
                $alpha = [byte](($max - $thresh) / (70.0 - $thresh) * 255)
                $rgbValues[$i+3] = $alpha
            } else {
                $rgbValues[$i+3] = 255
            }
        }
    }
    
    [System.Runtime.InteropServices.Marshal]::Copy($rgbValues, 0, $destData.Scan0, $bytes)
    $src.UnlockBits($srcData)
    $dest.UnlockBits($destData)
    
    $src.Dispose()
    $dest.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $dest.Dispose()
    Write-Host "Created transparent image at $outPath"
}

Remove-Black 'C:\Users\mdani\.gemini\antigravity-ide\brain\cc41dc6e-e683-482f-9946-d0e0c132bb66\silver_floral_crest_1791066591046.jpg' 'C:\Users\mdani\OneDrive\Desktop\DESARROLLO WEB\15 DE ISABELA\silver_flowers_center.png' 20
Remove-Black 'C:\Users\mdani\.gemini\antigravity-ide\brain\cc41dc6e-e683-482f-9946-d0e0c132bb66\silver_floral_divider_1791066613422.jpg' 'C:\Users\mdani\OneDrive\Desktop\DESARROLLO WEB\15 DE ISABELA\silver_flowers_divider.png' 20
