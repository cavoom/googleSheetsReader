rm index.zip
zip -X -r ../index.zip *
aws lambda update-function-code --function-name googlySheetReader --zip-file fileb://../index.zip