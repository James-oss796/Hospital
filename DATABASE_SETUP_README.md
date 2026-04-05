# AfyaFlow MySQL Database Setup

To get the Spring Boot backend running, you need a local MySQL database server configured to match the application's configuration.

## Required Configuration
- **Port:** `3306` (The default MySQL port)
- **Username:** `root`
- **Password:** `james1421`
- **Database Name:** `afyaflowdb`

---

## The Easiest Way (Using MySQL Installer for Windows)

### 1. Download and Install MySQL
1. Go to the [MySQL Community Downloads page](https://dev.mysql.com/downloads/installer/) and download the **MySQL Installer for Windows**.
2. Run the installer and choose the **"Developer Default"** or **"Server Only"** setup type.
3. Click through the installation steps until you reach the **"Accounts and Roles"** screen.
4. When it asks you to define the **MySQL Root Password**, enter exactly: `james1421`
5. Finish the setup. MySQL will automatically start running in the background as a Windows Service.

### 2. Create the Database Schema
The Spring Boot backend will automatically create all your tables, but it needs an empty schema folder to put them in first.

1. Open the **MySQL Workbench** program (this was installed alongside MySQL in step 1).
2. Click on your local root instance on the home screen to log in using the password `james1421`.
3. In the interface, click the **"SQL+"** button at the top left to open a new query tab.
4. Type the following command:
   ```sql
   CREATE DATABASE afyaflowdb;
   ```
5. Click the yellow **Lightning Bolt** icon ⚡ to execute the command. 

---

## Alternative Way (Using XAMPP)

If you use XAMPP for local development instead of MySQL Workbench:

1. Launch your **XAMPP Control Panel** and **Start** both Apache and MySQL.
2. Click the **Admin** button next to MySQL to open `phpMyAdmin` in your browser.
3. Click on the **User accounts** tab at the top.
4. Note your user `root` (Hostname `localhost`). Click **Edit privileges** next to it.
5. Click **Change password** at the top.
6. Enter `james1421` in both fields and click **Go**.
7. *Note: If XAMPP locks you out of phpMyAdmin after changing the password, open your `\xampp\phpMyAdmin\config.inc.php` file, find `$cfg['Servers'][$i]['password'] = '';` and change it to `$cfg['Servers'][$i]['password'] = 'james1421';`*
8. Finally, refresh phpMyAdmin, click **New** on the left sidebar, type `afyaflowdb`, and click **Create**.

---

### Startup
Once your database is prepared using either method above, you can start the Spring server. Open a terminal in the `AfyaFlow-Backend` folder and run:
```bash
.\mvnw.cmd spring-boot:run
```
