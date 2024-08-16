import { ChangeEvent, useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Add, Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { Tab } from "@headlessui/react";

import S3Helper from "@/helpers/S3Helper";
import { classNames, formatLink } from "@/helpers/GeneralHelpers";
import RequestHandler from "@/helpers/RequestHandler";

import Button from "@/components/Button";
import VESDialog from "@/components/VESDialog";
import Modal from "@/components/Modal";
import Fields, { CustomEvent, Field } from "@/components/Fields";
import ConfirmationDialog from "@/components/ConfirmationDialog";

import { EventContext } from "@/context/EventContext";
import { Material, Partner } from "@/types";

interface Props {
  open?: boolean;
}

const EditPartner = (props: Props) => {
  const context = useContext(EventContext);

  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [partner, setPartner] = useState<Partner | undefined>(undefined);
  const [materialData, setMaterialData] = useState<any>({});
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<any>(undefined);

  const partnerId = context.user?.partner?._id;

  const getPartner = async () => {
    if (!partnerId) return;
    const partner = await RequestHandler.get(
      `partners/${context.event?._id}/${partnerId}`
    );
    setPartner(partner);
  };
  useEffect(() => {
    getPartner();
  }, []);

  const partnerFields: Field[] = [
    {
      id: "logo",
      label: "Company logo",
      type: "imageBox",
    },
    {
      id: "name",
      label: "Company name",
    },
    {
      id: "slogan",
      label: "Company slogan",
    },
    {
      id: "description",
      label: "Company description",
      type: "textarea",
    },
    {
      id: "website",
      label: "Company website",
    },
    {
      id: "linkedin",
      label: "LinkedIn URL",
    },
    {
      id: "twitter",
      label: "Twitter URL",
    },
    {
      id: "facebook",
      label: "Facebook URL",
    },
    {
      id: "instagram",
      label: "Instagram URL",
    },
  ];

  const materialFields: Field[] = [
    {
      id: "name",
      label: "Name*",
    },
    {
      id: "thumbnail",
      label: "Thumbnail*",
      type: "image",
    },
    {
      id: "file",
      label: "File",
      type: "file",
    },
    {
      id: "link",
      label: "Link (if file not used)",
    },
  ];

  const openMaterial = (material: Material) => {
    if (material.asEmbed) {
      return;
    }
    window.open(material.url || formatLink(material.link), "_blank");
  };

  const createMaterial = async () => {
    setDialogLoading(true);
    if (materialData._id) {
      if (materialData.thumbnail && typeof materialData.thumbnail != "string") {
        S3Helper.uploadFile(materialData.thumbnail).then(
          async (thumbnailUrl) => {
            if (materialData.file && typeof materialData.file != "string") {
              S3Helper.uploadFile(materialData.file).then(async (url) => {
                const material = await RequestHandler.patch(
                  `materials/${materialData._id}`,
                  {
                    ...materialData,
                    thumbnailUrl,
                    url,
                    partner: partner?._id,
                    event: context.event?._id,
                  }
                );
                setDialogOpen(false);
                setDialogLoading(false);
                enqueueSnackbar("Material saved!", { variant: "success" });
                getPartner();
              });
            } else {
              const material = await RequestHandler.patch(
                `materials/${materialData._id}`,
                {
                  ...materialData,
                  thumbnailUrl,
                  partner: partner?._id,
                  event: context.event?._id,
                }
              );
              setDialogOpen(false);
              setDialogLoading(false);
              enqueueSnackbar("Material saved!", { variant: "success" });
              getPartner();
            }
          }
        );
      } else if (materialData.file && typeof materialData.file != "string") {
        S3Helper.uploadFile(materialData.file).then(async (url) => {
          const material = await RequestHandler.patch(
            `materials/${materialData._id}`,
            {
              ...materialData,
              url,
              partner: partner?._id,
              event: context.event?._id,
            }
          );
          setDialogOpen(false);
          setDialogLoading(false);
          enqueueSnackbar("Material saved!", { variant: "success" });
          getPartner();
        });
      } else {
        const material = await RequestHandler.patch(
          `materials/${materialData._id}`,
          {
            ...materialData,
            partner: partner?._id,
            event: context.event?._id,
          }
        );
        setDialogOpen(false);
        setDialogLoading(false);
        enqueueSnackbar("Material saved!", { variant: "success" });
        getPartner();
      }
    } else {
      S3Helper.uploadFile(materialData.thumbnail).then(async (thumbnailUrl) => {
        S3Helper.uploadFile(materialData.file).then(async (url) => {
          const material = await RequestHandler.post(`materials`, {
            ...materialData,
            partner: partner?._id,
            thumbnailUrl,
            url,
            event: context.event?._id,
          });
          setDialogOpen(false);
          setDialogLoading(false);
          enqueueSnackbar("Material saved!", { variant: "success" });
          getPartner();
        });
      });
    }
  };

  const closeModal = () => {
    const page = params.get("page");
    const query = page ? `?page=${page}` : "";
    router.push(`${pathname}${query}`);
  };

  const onSaveDetails = async () => {
    setLoading(true);
    if (partner?.logo && typeof partner?.logo != "string") {
      S3Helper.uploadLogo(partner?.logo).then(async (logo) => {
        const response = await RequestHandler.patch(
          `partners/${partner?._id}`,
          {
            logo,
            name: partner?.name,
            description: partner?.description,
            slogan: partner?.slogan,
            website: partner?.website,
            facebook: partner?.facebook,
            instagram: partner?.instagram,
            linkedin: partner?.linkedin,
            twitter: partner?.twitter,
          }
        );
        setLoading(false);
        closeModal();
        enqueueSnackbar("Details saved!", { variant: "success" });
      });
    } else {
      const response = await RequestHandler.patch(`partners/${partner?._id}`, {
        name: partner?.name,
        description: partner?.description,
        slogan: partner?.slogan,
        website: partner?.website,
        facebook: partner?.facebook,
        instagram: partner?.instagram,
        linkedin: partner?.linkedin,
        twitter: partner?.twitter,
      });
      setLoading(false);
      closeModal();
      enqueueSnackbar("Details saved!", { variant: "success" });
    }
  };

  const onInputChange = (e: CustomEvent) => {
    const value = {
      _id: "",
      name: "",
      logo: "",
      slogan: "",
      description: "",
      website: "",
      ...partner,
      [e.target?.name || ""]: e.target?.value,
    };
    setPartner(value);
  };

  const onMaterialInputChange = (e: CustomEvent) => {
    let value = e.target.value;
    setMaterialData({
      ...materialData,
      [e.target.name || ""]: value,
    });
  };

  const onDeleteMaterialPressed = async (material: Material) => {
    setMaterialToDelete(material);
  };

  const onDeleteMaterial = async (material: Material) => {
    setDeleteLoading(true);
    await RequestHandler.delete(`materials/${material._id}`);
    setMaterialToDelete(undefined);
    setDeleteLoading(false);
    enqueueSnackbar("Material deleted!", { variant: "success" });
    getPartner();
  };

  if (!partner) {
    return "Loading...";
  }

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return (
          <>
            <Fields
              fields={partnerFields}
              onInputChange={onInputChange}
              values={partner}
            />
            <Button
              className="mt-6 w-full text-center lg:w-fit"
              loading={loading}
              onClick={() => {
                onSaveDetails();
              }}
            >
              Save details
            </Button>
          </>
        );
      case 1:
        return (
          <div className="mb-16">
            <div className="flex items-center justify-end mb-2">
              <Button
                className="pl-0 text-sm"
                color="!text-green-800"
                secondary
                onClick={() => {
                  setMaterialData({});
                  setDialogOpen(true);
                }}
              >
                <Add className="!h-4 !w-4 mr-1" />
                Add material
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-2">
              {(partner.materials || []).map((m: Material) => (
                <div
                  key={m._id}
                  className="flex w-full h-44 relative items-end justify-center rounded border overflow-hidden shadow-sm"
                >
                  <img
                    className="object-cover absolute top-0 left-0 h-full w-full z-0"
                    src={m.thumbnailUrl}
                  />
                  <div className="flex items-center justify-end flex-1 absolute top-2 right-2">
                    <button
                      onClick={() => openMaterial(m)}
                      className="bg-white shadow-sm rounded-full flex items-center justify-center w-8 h-8 mr-2"
                    >
                      <RemoveRedEye className="!h-4 !w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setMaterialData({
                          ...m,
                          thumbnail: m.thumbnailUrl,
                          file: m.url,
                        });
                        setDialogOpen(true);
                      }}
                      className="bg-white shadow-sm rounded-full flex items-center justify-center w-8 h-8 mr-2"
                    >
                      <Edit className="!h-4 !w-4" />
                    </button>
                    <button
                      className="bg-white shadow-sm rounded-full flex items-center justify-center w-8 h-8"
                      onClick={() => onDeleteMaterialPressed(m)}
                    >
                      <Delete className="!h-4 !w-4" />
                    </button>
                  </div>
                  <div className="bg-wf-violet w-full z-2 relative p-2 m-0 text-white text-xs flex items-center">
                    <h3 className="font-bold flex-1">{m.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Modal
        open={props.open}
        title="Edit company details"
        description={`Please fill in your company details below.`}
      >
        <div className="mt-2 mb-4 w-full lg:w-fit max-w-full">
          <Tab.Group
            onChange={(index) => {
              setSelectedTab(index);
            }}
          >
            <Tab.List className="flex space-x-1 rounded-xl bg-wf-violet/20 p-1 w-full overflow-hidden">
              {["Details", "Materials"].map((category) => (
                <Tab
                  key={category}
                  className={({ selected }) =>
                    classNames(
                      "rounded-lg py-2 w-full lg:w-fit px-4 lg:px-8 text-sm font-medium leading-5 text-wf-violet outline-none",
                      selected ? "bg-white shadow" : "text-wf-violet/50"
                    )
                  }
                >
                  {category}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>
        {renderContent()}
        <VESDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          header={materialData._id ? "Edit material" : "Add material"}
          description="Fill in the material details and press 'Save'."
          saveDisabled={!materialData.name || !materialData.thumbnail}
          onSave={() => createMaterial()}
          fields={materialFields}
          onInputChange={onMaterialInputChange}
          loading={dialogLoading}
          values={materialData}
        />
        <ConfirmationDialog
          title="Delete material"
          description="Are you sure you want to delete this material?"
          open={!!materialToDelete}
          onConfirm={() => onDeleteMaterial(materialToDelete)}
          onClose={() => setMaterialToDelete(undefined)}
          loading={deleteLoading}
        />
      </Modal>
    </>
  );
};

export default EditPartner;
