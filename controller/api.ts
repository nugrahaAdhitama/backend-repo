import express, { Request, Response } from "express";
import User from "../repository/userCollection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { DocumentData } from "@google-cloud/firestore";
import { User as UserInterface } from "../helper/User";
import ApiError from "../entities/ApiError";

const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  // Check if username, email, and password are provided
  if (!username || !email || !password) {
    throw new ApiError(400, "Username, email, and password are required");
  }

  // Check if user already exists
  const usersSnapshot = await User.get();
  const users = usersSnapshot.docs.map((doc) => doc.data());
  const existingUser = users.find((user: any) => user.username === username);
  if (existingUser) {
    throw new ApiError(400, "User with this username already exists");
  }

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const data = {
    username,
    email,
    password: hashedPassword,
  };

  try {
    await User.add(data);

    // Only send the success message
    res.status(201).send({ message: "Successfully register user" });
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      throw new ApiError(400, "Username and password are required");
    }

    // Retrieve all users from the database
    const usersSnapshot = await User.get();
    if (usersSnapshot.empty) {
      throw new ApiError(400, "No users found");
    }

    // Find the user with the provided username
    const user = usersSnapshot.docs
      .map((doc) => doc.data())
      .find((user: any) => user.username === username);

    if (!user || !user.password) {
      throw new ApiError(400, "User does not exist or password is missing");
    }

    // Check if the provided password matches the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ApiError(400, "Incorrect password");
    }

    // Create JWT token
    const token = jwt.sign({ id: user.id }, "secret", {
      expiresIn: "1h",
    });

    // Send the success message and token
    res.status(200).send({ message: "Successfully logged in", token });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).send({ message: error.message });
    } else {
      res.status(500).send({ message: "An unknown error occurred" });
    }
  }
};

const createUser = async (req: Request, res: Response) => {
  const { name, email, address, phoneNumber } = req.body;

  // Check if name, email, address, and phoneNumber are provided
  if (!name || !email || !address || !phoneNumber) {
    throw new ApiError(
      400,
      "Name, email, address, and phone number are required"
    );
  }

  const data = {
    id: uuidv4(), // Generate a unique UUID for the user
    name,
    email,
    address,
    phoneNumber,
  };

  try {
    await User.add(data);

    // Send the success message
    res.status(201).send({ message: "Successfully add user" });
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};

const fetchUser = async (req: Request, res: Response) => {
  try {
    const userSnapshot = await User.get();
    const users = userSnapshot.docs
      .map(
        (doc) =>
          ({
            docId: doc.id,
            id: doc.data().id || "",
            name: doc.data().name || "",
            email: doc.data().email || "",
            address: doc.data().address || "",
            phoneNumber: doc.data().phoneNumber || "",
          } as UserInterface)
      )
      .filter((user: UserInterface) => user.id); // Only include users with an id in their document data

    // Send the success message and the fetched data
    res.status(200).send({ message: "Successfully get all data!", users });
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.query;
  const { name, email, address, phoneNumber } = req.body;

  if (!id) {
    throw new ApiError(400, "User id is required");
  }

  const userRef = User.doc(id as string);
  const doc = await userRef.get();

  if (!doc.exists) {
    throw new ApiError(404, "User not found");
  }

  const existingData = doc.data();

  const data: Partial<UserInterface> = {
    name: name ? name : existingData?.name,
    email: email ? email : existingData?.email,
    address: address ? address : existingData?.address,
    phoneNumber: phoneNumber ? phoneNumber : existingData?.phoneNumber,
  };

  try {
    await userRef.update(data);

    // Send the success message
    res.status(200).send({ message: "Successfully updated user!" });
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(500, error.message);
    } else {
      throw new ApiError(500, "An unknown error occurred");
    }
  }
};

const fetchUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "User id is required");
  }

  const userRef = User.doc(id);
  const doc = await userRef.get();

  if (!doc.exists) {
    throw new ApiError(404, "User not found");
  }

  const userData = doc.data();

  // Send the success message and user data
  res.status(200).send({ message: "Successfully fetched user data", userData });
};

export {
  registerUser,
  loginUser,
  createUser,
  fetchUser,
  updateUser,
  fetchUserById,
};
