import os
import re
import django
from django.db import connection


# loop through the migrations folder and delete migration files.
def remove_files_from_migration_dir(dir_name, sub_dir, current_dir):
    for _, _, sub_file_list in os.walk(f"{dir_name}/{sub_dir}/"):
        for file in sub_file_list:
            match = re.search("^00.*_.*.py$", file)
            if match:
                # if file name matches the pattern, remove the file.
                file_path = f"{current_dir}/{dir_name}/{sub_dir}/{file}"
                os.remove(file_path)
                print(f"removed {file_path}")


def remove_migration_files():
    root_dir = '..'
    current_dir = os.getcwd()
    # crowl the folders.
    for dir_name, sub_dirList, file_list in os.walk(root_dir):
        for sub_dir in sub_dirList:
            if sub_dir != "migrations":
                continue
            remove_files_from_migration_dir(dir_name, sub_dir, current_dir)


def recreate_db():
    with connection.cursor() as cursor:
        #database = os.environ.get('SQL_DATABASE')
        cursor.execute(f"DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;")
    print("Just reset the database..")


def migrate_again():
    print("making migration files and migrate again...")
    os.system("python manage.py makemigrations && python manage.py migrate")


# CAUTION! reset whole database and remove migration files!!!
def run():
    recreate_db()
    remove_migration_files()
    migrate_again()
