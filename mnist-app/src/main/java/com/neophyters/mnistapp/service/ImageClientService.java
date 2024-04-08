package com.neophyters.mnistapp.service;

import java.io.*;
import java.net.Socket;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class ImageClientService {

    private static final String SERVER_HOST = "127.0.0.1";
    private static final int SERVER_PORT = 65432;
    private static final int TIMEOUT = 10000;

    public String sendImageData(List<Float> imageData) {
        StringBuilder imageString = new StringBuilder();
        imageData.forEach(pixel -> imageString.append(String.format("%.2f ", pixel)));

        try (Socket socket = new Socket(SERVER_HOST, SERVER_PORT)) {
            socket.setSoTimeout(TIMEOUT);
            BufferedWriter out = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
            BufferedReader in = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            out.write(imageString.toString());
            out.newLine();
            out.flush();

            String label = in.readLine();
            return label;
        } catch (IOException e) {
            e.printStackTrace();
            return "Error: " + e.getMessage();
        }
    }
}
