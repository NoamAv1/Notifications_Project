# debug
# set -o xtrace

KEY_NAME="Notifications-DB-`date +'%N'`"
KEY_PEM="$KEY_NAME.pem"

echo "create key pair $KEY_PEM to connect to instances and save locally"
aws ec2 create-key-pair --key-name $KEY_NAME | jq -r ".KeyMaterial" > $KEY_PEM

# secure the key pair
chmod 400 $KEY_PEM

SEC_GRP="my-sg-`date +'%N'`"

echo "setup firewall $SEC_GRP"
SEC_GRP_ID=$(aws ec2 create-security-group   \
    --group-name $SEC_GRP       \
    --description "Access my instances" | jq -r '.GroupId')

MY_IP=$(curl ipinfo.io/ip)
echo "setup rule allowing SSH access to $MY_IP only"
aws ec2 authorize-security-group-ingress        \
    --group-name $SEC_GRP \
    --port 22 --protocol tcp \
    --cidr $MY_IP/32

DB_ID="db-`date +'%N'`"
USERNAME="postgres"
PASSWORD="12345678"

echo "Creating new RDS DataBase"
CREATE_DB=$(aws rds create-db-instance \
    --db-instance-identifier $DB_ID \
    --db-instance-class db.t2.micro \
    --engine postgres \
    --master-username $USERNAME \
    --master-user-password $PASSWORD \
    --backup-retention-period 0 \
    --vpc-security-group-ids $SEC_GRP_ID \
    --allocated-storage 5 | jq )

echo "Waiting for DB creation..."
aws rds wait db-instance-available --db-instance-identifier $DB_ID

DB_ADDRESS=$(aws rds describe-db-instances --db-instance-identifier $DB_ID | jq -r '.DBInstances[0].Endpoint.Address')
echo "$DB_ADDRESS"

echo "New DB created @ $DB_ADDRESS"