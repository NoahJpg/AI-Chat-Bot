import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Configuration, OpenAIApi } from "openai";

import colors from "../config/colors";
import {API_KEY} from "@env"

console.log(API_KEY)
const apiKey = API_KEY;

const configuration = new Configuration({
  apiKey: apiKey,
});

const openai = new OpenAIApi(configuration);

const Main = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInput = async () => {
    try {
      const userInput = input;

      // Create a new message object for the user's input
      const userMessage = {
        content: userInput,
        isUser: true,
      };

      // Add the user's message to the message history
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `You: ${userInput}\nAI`,
        temperature: 0,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
      });

      // Extract the chatbot's response from the OpenAI API
      const chatbotResponse = response.data.choices[0].text.replace(
        /^:\s*/,
        ""
      );

      // Create a new message object for the chatbot's response
      const chatbotMessage = {
        content: chatbotResponse,
        isUser: false,
      };

      // Add the chatbot's message to the message history
      setMessages((prevMessages) => [...prevMessages, chatbotMessage]);
    } catch (error) {
      console.log(error);
    }

    setInput("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>AI Chatbot</Text>

        <View style={styles.chatContainer}>
          <View style={styles.messageContainer}>
            {messages.map((message, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessage : styles.chatbotMessage,
                ]}
              >
                <Text style={styles.messageText}>{message.content}</Text>
              </View>
            ))}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message here"
              onChangeText={(text) => setInput(text)}
              value={input}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleInput}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.offwhite,
    padding: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    backgroundColor: colors.white,
  },
  output: {
    fontSize: 16,
  },
  outputContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 10,
  },
  safeArea: {
    flex: 1,
  },
  sendButtonText: {
    color: colors.white,
    fontWeight: "bold",
    textAlign: "center",
  },
  sendButton: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  messageContainer: {
    flex: 1,
    padding: 10,
  },
  messageBubble: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  chatbotMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.secondary,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Main;
