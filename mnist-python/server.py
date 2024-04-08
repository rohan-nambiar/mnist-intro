import socket
import mnist_apply
import torch

def start_server(host='127.0.0.1', port=65432):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)  # Set the SO_REUSEADDR flag
        s.bind((host, port))
        s.listen()
        print(f"Server listening on {host}:{port}")
        while True:
            conn, addr = s.accept()
            with conn:
                print('Connected by', addr)
                data = conn.recv(4096).decode()
                data_list = [float(item) for item in data.split()]
                image_tensor = torch.tensor([data_list])
                label = mnist_apply.evaluateImage(image_tensor)
                conn.sendall(str(label).encode())


if __name__ == '__main__':
    mnist_apply.initializeModel()
    start_server()
    