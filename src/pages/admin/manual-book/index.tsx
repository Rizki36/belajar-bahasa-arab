import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/common/components/ui/button";
import { Spinner } from "@/common/components/ui/spinner";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import type { NextPageWithLayout } from "@/pages/_app";

const ManualBookPage: NextPageWithLayout = () => {
  const { config, loading } = useSystemSetting();
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const openInNewTab = () => {
    if (!config.adminManualBookUrl) {
      toast.error("URL buku manual belum diatur");
      return;
    }
    window.open(config.adminManualBookUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!config.adminManualBookUrl) {
    return (
      <>
        <Head>
          <title>Manual Book Admin | Mudah belajar ilmu shorof</title>
        </Head>
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Buku Manual Admin</h1>
          </div>
          <div className="p-8 text-center border rounded-lg">
            <p className="mb-4 text-lg">URL buku manual belum diatur.</p>
            <p className="mb-6">
              Silakan atur URL buku manual di halaman{" "}
              <a
                href="/admin/setting"
                className="text-primary underline"
              >
                Pengaturan
              </a>
              .
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Manual Book Admin | Mudah belajar ilmu shorof</title>
      </Head>
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Buku Manual Admin</h1>
          <Button
            onClick={openInNewTab}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ExternalLinkIcon className="h-4 w-4" />
            Buka di Tab Baru
          </Button>
        </div>

        <div className="relative w-full h-[calc(100vh-160px)]">
          {isIframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <Spinner size="large" />
            </div>
          )}
          <iframe
            src={config.adminManualBookUrl}
            className="w-full h-full border rounded-lg"
            onLoad={() => setIsIframeLoading(false)}
            title="Admin Manual Book"
            allow="fullscreen"
          />
        </div>
      </div>
    </>
  );
};

ManualBookPage.getLayout = (page) => {
  return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default ManualBookPage;