var tmp: { database: string;port;secretKey: string };
tmp = {
    "database": "mongodb://root:temp#123@ds039058.mongolab.com:39058/userstory",
    "port": process.env.PORT || 3000,
    "secretKey": "YourSecretKey"
}
export = tmp;