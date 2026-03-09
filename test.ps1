try {
    $response = Invoke-RestMethod -Uri 'http://localhost:8080/api/categories' -Method Post -ContentType 'application/json' -Body '{"name":"test", "description":"test"}'
    $response | ConvertTo-Json
} catch {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $errorBody = $reader.ReadToEnd()
    Write-Output "Error: $errorBody"
}
