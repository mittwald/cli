import { FC } from "react";
import { Value } from "../Value.js";
import { SingleResult } from "../SingleResult.js";
import { Text } from "ink";

export const OrganizationOrderEligibility: FC<{
  competency: { isLegallyCompetent?: boolean };
}> = ({ competency }) => {
  return (
    <SingleResult
      key="competency"
      title="Order eligibility"
      rows={{
        "Can place orders?": (
          <Value>
            {competency.isLegallyCompetent ? (
              <Text color="green">yes</Text>
            ) : (
              <>
                <Text color="red">no</Text>
                <Text color="gray">
                  {" "}
                  (make sure to complete your organization owner profile)
                </Text>
              </>
            )}
          </Value>
        ),
      }}
    />
  );
};
