"use client"
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';

export default function Profile() {
  const { data: session, status } = useSession({ required: true });
  const [response, setResponse] = useState("{}");


  const getUserDetails = async (useToken) => { // useToken is a boolean
    // i added get user info api endpoint
    try {
      const response = await axios({
        method: "get",
        url: "/api/auth/user/",
        headers: useToken ? { Authorization: `Bearer ${session.accessToken}` } : {},
        });

        setResponse
    } catch (error) {
      setResponse(error.message);
    }
  };
console.log(session)
console.log(status)
console.log(response)
  if (status === "loading") {
    return (
      <div className="card flex justify-content-center">
        <div className="border-round border-1 surface-border p-4 surface-card">
          <Skeleton width="100%" height="150px" className="mb-2" />
          <Skeleton width="75%" className="mb-2" />
          <Skeleton width="50%" className="mb-2" />
        </div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="card flex justify-content-center">
        <Card className="w-full md:w-8 lg:w-6">
          <div className="flex flex-column align-items-center text-center mb-4">
            <Avatar
              image={session.user.image || "https://www.gravatar.com/avatar/?d=mp"}
              size="xlarge"
              shape="circle"
              className="mb-3"
            />
            <h2 className="text-2xl font-bold m-0">{session.user.username}</h2>
            <p className="text-500 m-0">{session.user.email || "No email provided"}</p>
          </div>

          <Divider />

          <div className="flex flex-column gap-3 mb-4">
            <div className="flex align-items-center">
              <i className="pi pi-id-card mr-2"></i>
              <span className="font-semibold">ID:</span>
              <span className="ml-2">{session.user.pk}</span>
            </div>
            <div className="flex align-items-center">
              <i className="pi pi-user mr-2"></i>
              <span className="font-semibold">Username:</span>
              <span className="ml-2">{session.user.username}</span>
            </div>
            <div className="flex align-items-center">
              <i className="pi pi-envelope mr-2"></i>
              <span className="font-semibold">Email:</span>
              <span className="ml-2">{session.user.email || "Not provided"}</span>
            </div>
          </div>

          {response !== "{}" && (
            <Message severity="info" className="w-full mb-4">
              <pre className="whitespace-pre-wrap">
                {response}
              </pre>
            </Message>
          )}

          <div className="flex flex-wrap justify-content-center gap-2">
            <Button
              label="Get Details"
              icon="pi pi-user"
              onClick={() => getUserDetails(true)}
              className="p-button-raised"
            />
            <Button
              label="Get Public Details"
              icon="pi pi-users"
              onClick={() => getUserDetails(false)}
              className="p-button-raised p-button-secondary"
            />
            <Button
              label="Sign Out"
              icon="pi pi-sign-out"
              onClick={() => signOut()}
              className="p-button-raised p-button-danger"
            />
          </div>
        </Card>
      </div>
    );
  }
}
