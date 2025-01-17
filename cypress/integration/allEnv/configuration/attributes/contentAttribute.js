import faker from "faker";

import { getAttribute } from "../../../../apiRequests/Attribute";
import { ATTRIBUTES_DETAILS } from "../../../../elements/attribute/attributes_details";
import { ATTRIBUTES_LIST } from "../../../../elements/attribute/attributes_list";
import { createAttributeWithInputType } from "../../../../steps/attributesSteps";
import { urlList } from "../../../../url/urlList";
import { deleteAttributesStartsWith } from "../../../../utils/attributes.js/attributeUtils";
import { expectCorrectDataInAttribute } from "../../../../utils/attributes.js/checkAttributeData";

describe("Create content attribute", () => {
  const startsWith = "AttrCont";
  const attributesTypes = [
    "DROPDOWN",
    "MULTISELECT",
    "FILE",
    "RICH_TEXT",
    "BOOLEAN"
  ];
  const attributeReferenceType = ["PRODUCT", "PAGE"];
  const attributeNumericType = [
    { unitSystem: "IMPERIAL", unitsOf: "DISTANCE", unit: "FT" },
    { unitSystem: "METRIC", unitsOf: "VOLUME", unit: "CUBIC_CENTIMETER" },
    { unitSystem: "without selecting unit" }
  ];

  before(() => {
    cy.clearSessionData().loginUserViaRequest();
    deleteAttributesStartsWith(startsWith);
  });

  beforeEach(() => {
    cy.clearSessionData()
      .loginUserViaRequest()
      .visit(urlList.attributes)
      .get(ATTRIBUTES_LIST.createAttributeButton)
      .click()
      .get(ATTRIBUTES_DETAILS.pageTypeAttributeCheckbox)
      .click();
  });
  attributesTypes.forEach(attributeType => {
    it(`should create ${attributeType} attribute`, () => {
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      createAttributeWithInputType({ name: attributeName, attributeType })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType
          });
        });
    });
  });

  attributeReferenceType.forEach(entityType => {
    it(`should create reference ${entityType} attribute`, () => {
      const attributeType = "REFERENCE";
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      createAttributeWithInputType({
        name: attributeName,
        attributeType,
        entityType
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            entityType
          });
        });
    });
  });

  attributeNumericType.forEach(numericSystemType => {
    it(`should create numeric attribute - ${numericSystemType.unitSystem}`, () => {
      const attributeType = "NUMERIC";
      const attributeName = `${startsWith}${faker.datatype.number()}`;
      createAttributeWithInputType({
        name: attributeName,
        attributeType,
        numericSystemType
      })
        .then(({ attribute }) => {
          getAttribute(attribute.id);
        })
        .then(attribute => {
          expectCorrectDataInAttribute(attribute, {
            attributeName,
            attributeType,
            unit: numericSystemType.unit
          });
        });
    });
  });

  it("should create attribute without required value", () => {
    const attributeType = "BOOLEAN";
    const attributeName = `${startsWith}${faker.datatype.number()}`;
    createAttributeWithInputType({
      name: attributeName,
      attributeType,
      valueRequired: false
    })
      .then(({ attribute }) => {
        getAttribute(attribute.id);
      })
      .then(attribute => {
        expectCorrectDataInAttribute(attribute, {
          attributeName,
          attributeType,
          valueRequired: false
        });
      });
  });
});
