import { join } from 'node:path'

import dotenv from 'dotenv'

dotenv.config({ path: join(import.meta.dirname, '.env.dev') })
