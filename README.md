# For Future Me
This is for future me, because I am 100% going to foget this

## The MySQL database
Start MySQL with `sudo systemctl start mysql`, then `sudo mysql -u root -p`
If this doesn't work, use `sudo mysqld_safe --skip-grant-tables &`, followed by `ALTER USER 'root@'localhost' IDENTIFIED BY 'password';`.

Then create a database, and setup the .env file like so:
```
DB_HOST=
DB_NAME=
DB_USER=
DB_PASSWORD=
```

If you ever forget, adding models, you want to first add it to AppDbContext.cs like this `public DbSet<Model> Models`. After run `dotnet ef migrations add MigrationName; dotnet ef database update`
