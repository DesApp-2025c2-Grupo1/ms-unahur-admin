SELECT
  a.dni,
  a."familyGroupId",
  a."memberNumber",
  a.credential,
  a."documentType",
  a."firstName",
  a."lastName",
  a."birthDate",
  a.relationship,
  a."validFrom",
  a."validUntil",
  p.name AS planname,
  string_agg(as2.observation, ', ' :: text) AS situationobservations,
  string_agg(ts.name, ', ' :: text) AS therapeuticsituationnames
FROM
  (
    (
      (
        (
          "Affiliate" a
          JOIN "FamilyGroup" fg ON ((a."familyGroupId" = fg.id))
        )
        JOIN "Plan" p ON ((p.id = fg."planId"))
      )
      JOIN "AffiliateSituation" as2 ON ((a.dni = as2.dni))
    )
    JOIN "TherapeuticSituation" ts ON ((as2."situationId" = ts.id))
  )
GROUP BY
  a.dni,
  a."familyGroupId",
  a."memberNumber",
  a.credential,
  a."documentType",
  a."firstName",
  a."lastName",
  a."birthDate",
  a.relationship,
  a."validFrom",
  a."validUntil",
  p.name;