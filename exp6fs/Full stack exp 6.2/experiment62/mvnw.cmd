@REM Maven Wrapper for Windows
@echo off
setlocal
set MAVEN_PROJECTBASEDIR=%~dp0
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
if not exist %WRAPPER_JAR% (
  echo Maven wrapper jar missing: %WRAPPER_JAR%
  exit /b 1
)
if "%JAVA_HOME%"=="" (
  set JAVA_EXE=java
) else (
  set JAVA_EXE="%JAVA_HOME%\bin\java.exe"
)
%JAVA_EXE% -classpath %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %*
exit /b %ERRORLEVEL%
