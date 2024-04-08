import json
import socket
from mnist_learn import train_loader, device
import matplotlib.pyplot as plt

def display_image(image_tensor):
    plt.imshow(image_tensor, cmap='gray')
    plt.show()

def start_client(server_host='127.0.0.1', server_port=65432, timeout=10):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(timeout)  # Set the timeout for the connection
        try:
            s.connect((server_host, server_port))
            for i, (images, labels) in enumerate(train_loader):
                display_image(images[0].squeeze().cpu().numpy())
                images = images.reshape(-1, 28*28).to(device).tolist()
                imageString = ""
                for pixel in images[0]:
                    imageString += "{:.2f} ".format(pixel)
                with open('imageData.json', 'w') as f:
                    json.dump({"imageData": imageString.strip()}, f)
                    f.write(imageString)
                    print(imageString)
                s.sendall(imageString.encode())
                break
            data = s.recv(4096)
            print(f"Received: {data.decode()}")
        except socket.timeout:
            print("Connection timed out")

start_client()
