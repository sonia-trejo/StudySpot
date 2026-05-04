# AWS Setup Instructions - What You Need to Do

## 🚨 IMMEDIATE ACTION REQUIRED

I can complete many requirements, but you need to fix the AWS IAM permissions first.

## **Step 1: Fix IAM Permissions (You must do this)**

### Option A: Add S3 Permissions to Existing User
1. Go to AWS Console → IAM → Users → studyspot-deploy
2. Click "Add permissions" → "Attach existing policies directly"
3. Search for and attach these policies:
   - `AmazonS3FullAccess`
   - `AWSLambdaFullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `CloudWatchFullAccess`

### Option B: Create New IAM Policy
1. Go to AWS Console → IAM → Policies → Create policy
2. Switch to JSON tab and paste this:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:*",
                "lambda:*",
                "apigateway:*",
                "cloudformation:*",
                "logs:*",
                "iam:*"
            ],
            "Resource": "*"
        }
    ]
}
```

3. Name it: `StudySpotDeployPolicy`
4. Attach it to your `studyspot-deploy` user

## **Step 2: Deploy API (I can do this after Step 1)**

Once you fix IAM permissions, I can deploy the API with:
```bash
cd api && npm run deploy
```

## **Step 3: Configure Supabase (I can guide you)**

Go to Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://main.d2jgun0v56d66n.amplifyapp.com`
- **Redirect URLs**: `https://main.*.amplifyapp.com/*`

## **What I Can Complete Right Now:**

### ✅ Documentation Updates
### ✅ Testing Scripts
### ✅ Configuration Files
### ✅ API Deployment (after IAM fix)
### ✅ Environment Variable Updates

## **What You Must Do:**

1. **Fix IAM permissions** (5-10 minutes)
2. **Configure Supabase URLs** (2 minutes)
3. **Test authentication** (5 minutes)

## **Total Time Remaining: ~20 minutes**

---

## **Ready When You Are:**

Once you fix the IAM permissions, tell me and I'll:
1. Deploy the API to Lambda
2. Update Amplify environment variables
3. Test all endpoints
4. Complete documentation

**The app is 80% ready - just need the AWS permissions fix!**
