
source ./flow-arg.sh

namespace='bolone-flow'
app='lm-wordbank'
apiapp='cyh'

echo $CI_COMMIT_REF_NAME								      # CI_COMMIT_REF_NAME 代码库的分支名
CI_COMMIT_REF_NAME_array=(${CI_COMMIT_REF_NAME//-/ })
# app=${CI_COMMIT_REF_NAME_array[0]}					# app
env=${CI_COMMIT_REF_NAME_array[1]}					# env [dev/fat/uat/pro]
ci_name=${app}-${env}

echo namespace:$namespace
echo app:$app
echo env:$env
echo ci_name:$ci_name



if [ $env == 'pro' ]
then
	apiurl=https://${apiapp}-api.bolone.cn
else
	apiurl=https://${apiapp}-api-${env}.bolone.cn
fi
echo apiurl:$apiurl

echo 'sed apiurl .env'
sed -i "s#\${apiurl}#${apiurl}#g" .env

sed -i "s#\${env}#${env}#g" .env

cat .env



if [ $env == 'pro' ]
then
	replicas=1
else
	replicas=1
fi

requestsCpu=10m
requestsMemory=16Mi

if [ $env == 'pro' ]
then
	requestsCpu=50m
	requestsMemory=64Mi
fi






# dockerEnd='COPY public/static/ico/'${app}'.ico  public/favicon.ico'
# dockerEnd=''

# cp public/static/ico/${app}.ico public/favicon.ico


echo 'sed Deployment.yaml'
sed -i "s#\${name}#$ci_name#g" Deployment.yaml
echo 'sed Deployment.yaml'
sed -i "s#\${namespace}#$namespace#g" Deployment.yaml
echo 'sed Deployment.replicas'
sed -i "s#\${replicas}#$replicas#g" Deployment.yaml

echo 'sed Deployment.request'
sed -i "s#\${requestsCpu}#$requestsCpu#g" Deployment.yaml
sed -i "s#\${requestsMemory}#$requestsMemory#g" Deployment.yaml






if [ $env == 'pro' ]
then
	ingressHostSsl=${app}.bolone.cn
else
	ingressHostSsl=${app}-${env}.bolone.cn
fi

echo 'sed Deployment.ingressHostSsl'
sed -i "s#\${ingressHostSsl}#$ingressHostSsl#g" Deployment.yaml






cat Deployment.yaml





cat Dockerfile
echo 'sed dockerEnd Dockerfile'
sed -i "s#\${dockerEnd}#${dockerEnd}#g" Dockerfile
cat Dockerfile




echo 'over and over'




# read Arg

