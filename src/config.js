import dotenv from 'dotenv'
import MongoStore from 'connect-mongo'
import parseArgs from 'minimist'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const argv = parseArgs(process.argv.slice(2), {
    alias: {
        p: 'port',
        m: 'mode'
    },
    default: {
        port: 8090,
        mode: 'FORK'
    }
})

const advancedOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

export default {
    PORT: argv.port,
    mode: argv.mode,
    fileSystem: {
        path: './DB'
    },
    mongodb: {
        cnxStr: 'mongodb+srv://aureliamp:sQaQZAiOvFoVvsHj@cluster0.4btgkst.mongodb.net/test',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: {
        "type": "service_account",
        "project_id": "coder-backend-amonnier",
        "private_key_id": process.env.PRIVATE_KEY_ID,
        "private_key": process.env.PRIVATE_KEY
                        ? process.env.PRIVATE_KEY.replace(/\\n/gm, "\n")
                    : undefined,
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
      },
    sqlite3: {
        client: 'sqlite3',
        connection: {
            filename: __dirname + '/../DB/ecommerce.sqlite'
        },
        useNullAsDefault: true
    },
    mariaDb: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: 'root',
            database: 'coderhouse_01',
            port: 8889
        }
    },
    session:{
        store: MongoStore.create({
            // local
            mongoUrl: process.env.MONGO_URL,
            mongoOptions: advancedOptions,
            ttl:60,
            collectionName: process.env.MONGODB_COLLECTION_NAME
        }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000
        }
    }
}
