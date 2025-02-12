import React, { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { signUpUser } from "@/lib/server";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignIn() {
  const { toast } = useToast();
  const router = useRouter();
  const [input, setInput] = useState({
    first: "",
    last: "",
    email: "",
    password: "",
  });

  const handleUpdateInput =
    (prop: keyof typeof input) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => {
        return {
          ...prev,
          [prop]: e.target.value,
        };
      });
    };

  const handleSignUpUser = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = {
        name: input.first + " " + input.last,
        email: input.email,
        password: input.password,
      } as User;
      await signUpUser(data);
      toast({
        title: "Success",
        description: "Account created! redirecting to login.",
      });
      router.replace("/auth/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to singup, try again later.",
      });
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Pattern"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to Legal Ledger 📒
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Secure Legal Records Management with Blockchain Technology -
              Scalable and Integrated Solution
            </p>

            <form
              action="#"
              className="mt-8 grid grid-cols-6 gap-6"
              onSubmit={handleSignUpUser}
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FirstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>

                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  className="mt-1 w-full rounded-lg border-gray-500 bg-gray-100 text-sm text-gray-700 shadow-sm p-2"
                  value={input.first}
                  onChange={handleUpdateInput("first")}
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="LastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>

                <input
                  type="text"
                  id="LastName"
                  name="last_name"
                  className="mt-1 w-full rounded-lg border-gray-500 bg-gray-100 text-sm text-gray-700 shadow-sm p-2"
                  value={input.last}
                  onChange={handleUpdateInput("last")}
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who are you?
                </label>
                <RadioGroup defaultValue="option-one">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="advocate" id="advocate" />
                    <Label htmlFor="advocate">Advocate</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="judge" id="judge" />
                    <Label htmlFor="judge">Judge</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client">Client</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700 "
                >
                  Email
                </label>

                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="mt-1 w-full rounded-lg border-gray-500 bg-gray-100 text-sm text-gray-700 shadow-sm p-2"
                  value={input.email}
                  onChange={handleUpdateInput("email")}
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>

                <input
                  type="password"
                  id="Password"
                  name="password"
                  className="mt-1 w-full rounded-lg border-gray-500 bg-gray-100 text-sm text-gray-700 shadow-sm p-2"
                  value={input.password}
                  onChange={handleUpdateInput("password")}
                  required
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                  Create an account
                </button>

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?
                  <Link href="/auth/login" className="text-gray-700 underline">
                    Log in
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = async ({ req }) => {
  const cookies = parse(req.headers.cookie ?? "");
  if (
    cookies["legal-ledger-access-token"] &&
    cookies["legal-ledger-refresh-token"]
  ) {
    return {
      props: {},
      redirect: {
        destination: "/dashboard",
        permanent: true,
      },
    };
  }
  return { props: {} };
};
