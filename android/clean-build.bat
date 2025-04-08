@echo off
echo Cleaning environment...
set GRADLE_OPTS=
set JAVA_OPTS=
cd android
echo Running Gradle clean...
call gradlew.bat --stop
call gradlew.bat clean
echo Building debug APK...
call gradlew.bat installDebug