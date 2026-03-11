$url = "http://localhost:8082/api/categories"
$body = @{
    name        = "TestCategory2"
    description = "test"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -ContentType "application/json" -Body $body
    Write-Output "Success:"
    $response | ConvertTo-Json
}
catch {
    Write-Output "Error occurred:"
    Write-Output $_.Exception.Message
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $errorBody = $reader.ReadToEnd()
    Write-Output "Response Body: $errorBody"
}