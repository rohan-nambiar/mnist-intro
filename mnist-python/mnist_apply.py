import torch
import torch.nn as nn
import torchvision
import torchvision.transforms as transforms
import matplotlib.pyplot as plt
from mnist_learn import NeuralNet, input_size, hidden_size, num_classes, device, batch_size, test_loader

model = NeuralNet(input_size, hidden_size, num_classes).to(device)

def initializeModel():
    model.load_state_dict(torch.load("out/mnist.pth"))

def testModel(): 
    with torch.no_grad():
        n_correct = 0
        n_samples = 0
        for images, labels in test_loader:
            images = images.reshape(-1, 28*28).to(device)
            labels = labels.to(device)
            print(images.type)
            print(images.shape)
            outputs = model(images)
            # max returns (value ,index)
            _, predicted = torch.max(outputs.data, 1)
            n_samples += labels.size(0)
            n_correct += (predicted == labels).sum().item()

        acc = 100.0 * n_correct / n_samples
        print(f'Accuracy of the network on the 10000 test images: {acc} %')
        
def evaluateImage(image):
    with torch.no_grad():
        output = model(image)
        _, predicted = torch.max(output.data, 1)
        return predicted.item()
    
if __name__ == '__main__':
    print("Model trained and saved to out/mnist.pth")
    testModel()