export const QUESTIONS_FORM_SECTIONS = {
  general: {
    title: "General",
    colorClass: "bg-blue-200 dark:bg-blue-500",
    text: "All open-source licenses allow commercial use, private use, modification and distribution.",
    questions: {
      patentUseAllowed: {
        disableIfSet: ["patentUseDisallowed"],
        label: "The license provides an express grant of " +
          "<a href='https://opensource.stackexchange.com/a/6305' target='_blank' rel='noopener noreferrer'>patent rights</a> from contributors.",
        description: "Licenses without such a statement probably do not grant any implicit trademark rights."
      },
      patentUseDisallowed: {
        disableIfSet: ["patentUseAllowed"],
        label: "The license <strong>explicitly does not</strong> provide a grant of " +
          "<a href='https://opensource.stackexchange.com/a/6305' target='_blank' rel='noopener noreferrer'>patent rights</a> from contributors."
      },
      osiApproved: { label: "The license is OSI approved." },
      fsfLibre: {
        label: "The license complies with " +
          "<a href='https://www.gnu.org/philosophy/free-sw.html.en' target='_blank' rel='noopener noreferrer'>the definition of free software by the FSF</a>."
      }
    }
  },
  conditions: {
    title: "Conditions",
    colorClass: "bg-yellow-200 dark:bg-yellow-400 dark:text-black",
    questions: {
      includeLicenseAlways: {
        disableIfSet: ["includeLicenseSource"],
        label: "The license must be included with the software when it is distributed <strong>in whatever form</strong> (binary or source)."
      },
      includeLicenseSource: {
        disableIfSet: ["includeLicenseAlways"],
        label: "The license must only be included with the software when it is distributed <strong>in source form</strong>.",
        description: "Including the license is not required if the software is distributed in binary form."
      },
      documentChanges: { label: "Modifications must be documented." },
      discloseSource: { label: "The source code must be made available when the software is distributed." },
      discloseSourceNetwork: { label: "Users that interact with the software via network are given the right to receive the source code." },
      sameLicense: {
        disableIfSet: ["sameLicenseFile", "sameLicenseLibrary"],
        label: "Modifications must be released under the same license when distributing the software.",
        description: "In some cases a similar or related license may be used."
      },
      sameLicenseFile: {
        disableIfSet: ["sameLicense", "sameLicenseLibrary"],
        label: "Modifications of <strong>existing files</strong> must be released under the same license when distributing the software.",
        description: "In some cases a similar or related license may be used."
      },
      sameLicenseLibrary: {
        disableIfSet: ["sameLicenseFile", "sameLicense"],
        label: "Modifications must be released under the same license when distributing the software, except for works that use the software as library.",
        description: "In some cases a similar or related license may be used."
      }
    }
  },
  limitations: {
    title: "Limitations",
    colorClass: "bg-red-200 dark:bg-red-500",
    questions: {
      trademarkUse: {
        label: "The license <strong>explicitly does not</strong> grant trademark rights.",
        description: "Licenses without such a statement probably do not grant any implicit trademark rights."
      },
      liability: { label: "The license includes a limitation of liability." },
      warranty: { label: "The license <strong>explicitly states that it does not</strong> provide any warranty." }
    }
  }
}
