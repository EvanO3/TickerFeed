import React from 'react'
import "../index.css"
import * as Form from "@radix-ui/react-form";

function auth() {
  return (
    <div className="Form">
      <Form.Root>
        <Form.Field className="FormField" name="firstname">
          <Form.Label className="FormLabel">First Name</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please Enter your First Name
          </Form.Message>
          <Form.Control asChild>
            <input className="Input" type="text" required />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="lastname">
          <Form.Label className="FormLabel">Last Name</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please Enter your Last Name
          </Form.Message>
          <Form.Control asChild>
            <input className="Input" type="text" required />
          </Form.Control>
        </Form.Field>

        <Form.Field className="FormField" name="email">
          <Form.Label className="FormLabel">Email</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please Enter your Email Name
          </Form.Message>
          <Form.Message className="FormMessage" match="typeMismatch">
            Please Enter a valid email
          </Form.Message>
          <Form.Control asChild>
            <input className="Input" type="email" required />
          </Form.Control>
        </Form.Field>

        <Form.Field className="FormField" name="password">
          <Form.Label className="FormLabel">Password</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please Enter a password 
          </Form.Message>
          <Form.Control asChild>
            <input className="Input" type="password" required />
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button className ="Button"></button>
        </Form.Submit>
      </Form.Root>



    </div>
  );
}

export default auth