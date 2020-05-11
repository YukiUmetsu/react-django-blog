import os
import re
from django.db import connection
from django.core import management


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
        cursor.execute(f"DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO public;")
    print("Just reset the database..")


def migrate_again():
    print("making migration files and migrate again...")
    management.call_command("makemigrations")
    management.call_command("migrate")


def create_superusers():
    print("creating superusers...")
    management.call_command("runscript", "add_superuser")


def create_test_users():
    management.call_command("runscript", "seed_users")


def load_initial_data():
    print("loading fixtures...")
    os.system("python3 manage.py loaddata */fixtures/*.json")
    print("loading posts fixtures...")
    os.system("python3 manage.py loaddata */posts_fixtures/*.json")
    print("loading post likes fixtures...")
    os.system("python3 manage.py loaddata */post_likes_fixtures/*.json")
    print("loading comments fixtures...")
    os.system("python3 manage.py loaddata */comments_fixtures/*.json")

# CAUTION! reset whole database and remove migration files!!!
def run():
    recreate_db()
    remove_migration_files()
    migrate_again()
    create_superusers()
    create_test_users()
    load_initial_data()
