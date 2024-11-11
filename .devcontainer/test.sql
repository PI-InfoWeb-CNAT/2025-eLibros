DO $$ 
BEGIN
   IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eLibrosDB') THEN
      CREATE DATABASE "eLibrosDB";
   END IF;
END
$$;