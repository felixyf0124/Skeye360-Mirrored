# Generated by Django 2.0 on 2019-10-22 22:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('djangosite_api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='token',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='username',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
