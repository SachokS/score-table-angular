interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  /**
   * Built-in environment variable.
   * @see Docs https://github.com/chihab/dotenv-run/packages/angular#node_env.
   */
  readonly NODE_ENV: string;
  // Add your environment variables below
  NG_APP_FIREBASE_CONFIG: string;
  NG_APP_FIREBASE: string;

  // readonly NG_APP_API_URL: string;
  [key: string]: any;
}

/*
 * Remove all the deprecated code below if you're using import.meta.env (recommended)
 */

