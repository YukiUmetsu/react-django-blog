# Generated by Django 3.0.3 on 2020-04-13 01:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('quiz_options', '0001_initial'),
        ('quizzes', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='quizoptions',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='quizzes.Quizzes'),
        ),
    ]
