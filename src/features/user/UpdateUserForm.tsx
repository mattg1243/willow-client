import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import {
  getUserContactInfo,
  updateUser,
  UpdateUserInput,
} from "@/lib/api/user";
import { useUser } from "@/lib/auth";
import { system } from "@/theme";
import { Card, HStack, Input } from "@chakra-ui/react";
import { DollarSign, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { withMask } from "use-mask-input";
import { User, UserContactInfo } from "../../types/api";

export function UpdateUserForm() {
  const [userState, setUserState] = useState<User | null>();
  const [contactInfo, setContactInfo] = useState<UserContactInfo>();
  const [loading, setLoading] = useState<boolean>(false);

  const { user, dispatch } = useUser();

  useEffect(() => {
    setUserState(user);
    getUserContactInfo()
      .then((res) => {
        setContactInfo(res);
      })
      .catch((err) => console.error(err));
  }, [user]);

  const handleSubmit = async () => {
    setLoading(true);
    if (userState && contactInfo) {
      try {
        const data: UpdateUserInput = {
          user: {
            fname: userState.fname,
            lname: userState.lname,
            nameforheader: userState.nameforheader,
            license: userState.license as string | undefined,
            rate: userState.rate as number,
          },
          contactInfo: {
            phone: contactInfo.phone as string | undefined,
            city: contactInfo.city as string | undefined,
            state: contactInfo.state as string | undefined,
            street: contactInfo.street as string | undefined,
            zip: contactInfo.zip as string | undefined,
            paymentInfo: {
              venmo: contactInfo.paymentinfo?.venmo as string | undefined,
              paypal: contactInfo.paymentinfo?.paypal as string | undefined,
            },
          },
        };

        const updatedUser = await updateUser(data);
        console.log("updatedUser: ", updatedUser);
        dispatch({ type: "SET_USER", payload: updatedUser });
        toaster.create({
          type: "success",
          title: "Your profile has been updated.",
        });
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (user && userState && contactInfo)
    return (
      <Card.Root width={480} marginBottom={24} shadow='lg'>
        <Card.Body gap="8">
          <Card.Title>Update your profile</Card.Title>
          <Field label="Personal info" gap={8}>
            <Field label="First name" required>
              <Input
                onChange={(e) =>
                  setUserState({ ...userState, fname: e.target.value })
                }
                value={userState.fname}
              />
            </Field>
            <Field label="Last name">
              <Input
                onChange={(e) =>
                  setUserState({ ...userState, lname: e.target.value })
                }
                value={userState.lname}
              />
            </Field>
            <Field
              label={
                <>
                  Name for statement
                  <Tooltip content="This will appear in the header of your statements. If not provided, we will use your first and last name.">
                    <Info size={16} />
                  </Tooltip>
                </>
              }>
              <Input
                onChange={(e) =>
                  setUserState({ ...userState, nameforheader: e.target.value })
                }
                value={userState.nameforheader}
              />
            </Field>
            <Field label="License">
              <Input
                onChange={(e) =>
                  setUserState({ ...userState, license: e.target.value })
                }
                value={userState.license as string}
              />
            </Field>
            <Field
              label="Pay rate"
              helperText="Your hourly rate, used to calculate event charges.">
              <InputGroup
                startElement={<DollarSign size={16} />}
                width={"100%"}
                endElement={<>per hr</>}>
                <Input
                  type="number"
                  onChange={(e) =>
                    setUserState({
                      ...userState,
                      rate: parseInt(e.target.value) * 100,
                    })
                  }
                  value={userState.rate ? userState.rate / 100 : undefined}
                />
              </InputGroup>
            </Field>
          </Field>
          <Field label="Contact and payment info" gap={8}>
            <Field label="Phone number">
              <Input
                ref={withMask("(999) 999-9999")}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    phone: e.target.value,
                  })
                }
                value={contactInfo.phone as string}
              />
            </Field>
            <Field label="Street">
              <Input
                onChange={(e) => {
                  setContactInfo({
                    ...contactInfo,
                    street: e.target.value,
                  });
                }}
                value={contactInfo.street as string}
              />
            </Field>
            <HStack width="100%">
              <Field label="City">
                <Input
                  onChange={(e) => {
                    setContactInfo({
                      ...contactInfo,
                      city: e.target.value,
                    });
                  }}
                  value={contactInfo.city as string}
                />
              </Field>
              <Field label="State">
                <Input
                  onChange={(e) => {
                    setContactInfo({
                      ...contactInfo,
                      state: e.target.value,
                    });
                  }}
                  value={contactInfo.state as string}
                />
              </Field>
            </HStack>
            <Field label="Zip code">
              <Input
                onChange={(e) => {
                  setContactInfo({
                    ...contactInfo,
                    zip: e.target.value,
                  });
                }}
                value={contactInfo.zip as string}
              />
            </Field>
            <Field label="Payment info">
              <Field label="Venmo" orientation="horizontal">
                <Input
                  onChange={(e) => {
                    setContactInfo({
                      ...contactInfo,
                      paymentinfo: {
                        ...contactInfo.paymentinfo,
                        venmo: e.target.value,
                      },
                    });
                  }}
                  value={contactInfo.paymentinfo?.venmo as string}
                />
              </Field>
              <Field label="PayPal" orientation="horizontal">
                <Input
                  onChange={(e) => {
                    setContactInfo({
                      ...contactInfo,
                      paymentinfo: {
                        ...contactInfo.paymentinfo,
                        paypal: e.target.value,
                      },
                    });
                  }}
                  value={contactInfo.paymentinfo?.paypal as string}
                />
              </Field>
            </Field>
          </Field>
        </Card.Body>
        <Card.Footer justifyContent="center">
          <HStack gap="4">
            <Button
              bg={system.token("colors.primary.500")}
              onClick={() => handleSubmit()}
              loading={loading}>
              Save
            </Button>
          </HStack>
        </Card.Footer>
      </Card.Root>
    );
}
// phone: contactInfo.phone as string | undefined,
//           city: contactInfo.city as string | undefined,
//           state: contactInfo.state as string | undefined,
//           street: contactInfo.street as string | undefined,
//           zip: contactInfo.zip as string | undefined,
//           paymentInfo: {
//             venmo: contactInfo.paymentinfo.venmo as string | undefined,
//             paypal: contactInfo.paymentinfo.paypal as string | undefined,
//           },
