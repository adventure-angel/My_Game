Add-Type -AssemblyName System.Drawing
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
foreach ($name in @('companions-v3','rewards-v3')) {
  $inputArt = [System.Drawing.Image]::FromFile((Join-Path $PWD "assets/$name.png"))
  foreach ($variant in @(@{suffix='';width=$inputArt.Width;quality=88},@{suffix='-mobile';width=1000;quality=62})) {
    $artWidth=[int]$variant.width
    $artHeight=[int]($inputArt.Height*$artWidth/$inputArt.Width)
    $bitmap=New-Object System.Drawing.Bitmap($artWidth,$artHeight)
    $graphics=[System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($inputArt,0,0,$artWidth,$artHeight)
    $parameters=New-Object System.Drawing.Imaging.EncoderParameters(1)
    $parameters.Param[0]=New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality,([long]$variant.quality))
    $bitmap.Save((Join-Path $PWD ('assets/'+$name+$variant.suffix+'.jpg')),$codec,$parameters)
    $parameters.Dispose();$graphics.Dispose();$bitmap.Dispose()
  }
  $inputArt.Dispose()
}
