from django.core.management.base import BaseCommand
from core.models import User, Team, Activity, Workout, Leaderboard
from django.utils import timezone

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Clear existing data
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        User.objects.all().delete()
        Team.objects.all().delete()
        Workout.objects.all().delete()

        # Teams
        marvel = Team.objects.create(name='marvel', description='Marvel superheroes')
        dc = Team.objects.create(name='dc', description='DC superheroes')

        # Users
        users = [
            User(email='tony@stark.com', name='Tony Stark', team='marvel', is_superhero=True),
            User(email='steve@rogers.com', name='Steve Rogers', team='marvel', is_superhero=True),
            User(email='bruce@wayne.com', name='Bruce Wayne', team='dc', is_superhero=True),
            User(email='clark@kent.com', name='Clark Kent', team='dc', is_superhero=True),
        ]
        User.objects.bulk_create(users)

        # Workouts
        workouts = [
            Workout(name='Super Strength', description='Heavy lifting workout', suggested_for='marvel'),
            Workout(name='Flight Training', description='Aerobic and agility', suggested_for='dc'),
        ]
        Workout.objects.bulk_create(workouts)

        # Activities
        tony = User.objects.get(email='tony@stark.com')
        bruce = User.objects.get(email='bruce@wayne.com')
        Activity.objects.create(user=tony, type='Iron Suit Training', duration=60, date=timezone.now())
        Activity.objects.create(user=bruce, type='Martial Arts', duration=90, date=timezone.now())

        # Leaderboard
        Leaderboard.objects.create(team=marvel, points=100)
        Leaderboard.objects.create(team=dc, points=80)

        self.stdout.write(self.style.SUCCESS('octofit_db populated with test data.'))
