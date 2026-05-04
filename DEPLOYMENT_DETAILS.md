# Deployment Details & Resource IDs

## 🚀 AWS Resources

### API Gateway
- **API ID**: 5cr1fhtxv1
- **API URL**: https://5cr1fhtxv1.execute-api.us-east-1.amazonaws.com
- **Stage**: prod
- **Region**: us-east-1

### Lambda Function
- **Function Name**: studyspot-api-prod-api
- **Runtime**: Node.js 18.x
- **Memory**: 256 MB
- **Timeout**: 30 seconds
- **Handler**: lambda.handler

### CloudWatch
- **Log Group**: /aws/lambda/studyspot-api-prod-api
- **Retention**: 30 days
- **Error Metric**: ErrorCount (Lambda/Errors namespace)
- **Alarm**: StudySpot-API-Errors (10 errors in 5 minutes)

### Secrets Manager
- **Secret Name**: studyspot/api/prod
- **ARN**: arn:aws:secretsmanager:us-east-1:846719029083:secret:studyspot/api/prod-glwtOB
- **Region**: us-east-1

### IAM
- **User**: studyspot-deploy
- **Policies**: IAMFullAccess, AmazonS3FullAccess, AWSLambdaFullAccess, AmazonAPIGatewayAdministrator, CloudWatchFullAccess

## 🌐 Frontend Deployment

### AWS Amplify
- **App ID**: d2jgun0v56d66n
- **Branch**: main (Production)
- **URL**: https://main.d2jgun0v56d66n.amplifyapp.com
- **Build Directory**: client/dist
- **Build Command**: npm run build

### Environment Variables
- `VITE_SUPABASE_URL`: https://qeqpwqdnwbjsgldiorte.supabase.co
- `VITE_SUPABASE_ANON_KEY`: [Configured in Amplify]
- `VITE_API_BASE_URL`: https://5cr1fhtxv1.execute-api.us-east-1.amazonaws.com

## 🔄 Deployment Commands

### API Deployment
```bash
cd api
npm run deploy
```

### Frontend Deployment
```bash
cd client
npm run build
git add . && git commit -m "Update frontend"
git push origin main
```

### API Removal (if needed)
```bash
cd api
npx serverless remove
```

## 🔄 Rollback Procedures

### API Rollback
```bash
cd api
serverless rollback --timestamp <timestamp>
```

### Frontend Rollback
```bash
git log --oneline
git checkout <previous-commit>
git push origin main --force
```

## 📊 Monitoring & Alerts

### CloudWatch Monitoring
- **Logs**: /aws/lambda/studyspot-api-prod-api
- **Metrics**: ErrorCount, Duration, Invocations
- **Alarms**: StudySpot-API-Errors (10 errors/5min)

### Amplify Monitoring
- **Build Logs**: Available in Amplify console
- **Build Failures**: Email notifications enabled
- **Performance**: Available in Amplify console

---

*Last Updated: 2026-05-04*
