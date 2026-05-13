# Use the latest Debian image
FROM debian:latest

# Add metadata to the image
LABEL Name=educationbackendmaster Version=0.0.1

# Update package index and install fortune
RUN apt-get update && apt-get install -y fortune-mod fortunes && apt-get clean

# Set the default command to run fortune in a loop
ENTRYPOINT ["sh", "-c", "while true; do fortune -a | cat; sleep 10; done"]
