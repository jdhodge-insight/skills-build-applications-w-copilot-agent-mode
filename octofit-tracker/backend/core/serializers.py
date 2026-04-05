from rest_framework import serializers
from .models import User, Team, Activity, Workout, Leaderboard


class UserSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = '__all__'


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Team
        fields = '__all__'


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    # represent related user by its id string to avoid ObjectId serialization issues
    user = serializers.SerializerMethodField()

    def get_user(self, obj):
        try:
            return str(obj.user.id) if obj.user else None
        except Exception:
            return None

    class Meta:
        model = Activity
        fields = '__all__'


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Workout
        fields = '__all__'


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    team = serializers.SerializerMethodField()

    def get_team(self, obj):
        try:
            return str(obj.team.id) if obj.team else None
        except Exception:
            return None

    class Meta:
        model = Leaderboard
        fields = '__all__'
