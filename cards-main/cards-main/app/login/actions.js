// "use server";

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

// import { createClient } from "@/utils/supabase/server";

// export async function login(formData) {
//   const supabase = await createClient();
//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const userData = {
//     email: formData[0].email,
//     password: formData[1].password,
//   };

//   const { data, error } = await supabase.auth.signInWithPassword(userData);

//   if (!error) {
//     console.log("testAuthUser", data.user.id);
//     const { data: user, error: userError } = await supabase
//       .from("users")
//       .select("*")
//       .eq("id", data.user.id);

//     if (!userError) {
//       console.log("plapapal: ", user);
//       redirect("/word-sets");
//       return user[0];
//     }
//   } else {
//     return error;
//   }

//   //   revalidatePath("/", "layout");
// }

// export async function signup(formData) {
//   const supabase = await createClient();

//   const userData = {
//     email: formData[0].email,
//     password: formData[1].password,
//   };

//   const { data, error } = await supabase.auth.signUp(userData);

//   if (!error) {
//     console.log("testAuthUser from signup", data);
//     const { data: user, error: userError } = await supabase
//       .from("users")
//       .insert([
//         {
//           id: data.user.id,
//           name: formData[2].username,
//           email: data.user.email,
//         },
//       ]);
//     if (!userError) {
//       console.log("plapapal: ", user);
//       redirect("/login");
//       return {
//         id: data.user.id,
//         email: formData[0].email,
//         name: formData[2].username,
//       };
//     }
//   } else {
//     redirect("/error");
//   }

//   //   revalidatePath("/", "layout");
// }

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Helper function to get user by ID
async function getUserById(supabase, userId) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  return { user, error };
}

export async function login(formData) {
  const supabase = await createClient();

  const userData = {
    email: formData[0]?.email,
    password: formData[1]?.password,
  };

  if (!userData.email || !userData.password) {
    return { error: "Email and password are required." };
  }

  const { data, error } = await supabase.auth.signInWithPassword(userData);

  if (error) {
    console.error("Login error:", error.message);
    return { error: error.message }; // Return the error message
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id);

  if (userError) {
    console.error("User fetch error:", userError.message);
    return { error: userError.message }; // Return the error message
  }

  return { user: user[0] }; // Return the user data if successful
}

export async function signup(formData) {
  const supabase = await createClient();

  const userData = {
    email: formData[0]?.email,
    password: formData[1]?.password,
  };
  const username = formData[2]?.username;

  if (!userData.email || !userData.password || !username) {
    return { error: "All fields (email, password, username) are required." };
  }

  const { data, error } = await supabase.auth.signUp(userData);

  if (error) {
    console.error("Signup error:", error.message);
    return { error: error.message };
  }

  const { data: user, error: userError } = await supabase.from("users").insert([
    {
      id: data.user.id,
      name: username,
      email: data.user.email,
    },
  ]);

  if (userError) {
    console.error("User insert error:", userError.message);
    return { error: userError.message };
  }

  console.log("New user created:", user);
  redirect("/login");
  // const firstUser =
  return {
    user: {
      id: data.user.id,
      email: userData.email,
      name: username,
    },
  };
}
