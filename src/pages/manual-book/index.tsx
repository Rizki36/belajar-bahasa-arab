import { ExternalLinkIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/common/components/ui/button";
import { Spinner } from "@/common/components/ui/spinner";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import ClientMainLayout from "@/common/layouts/MainLayout";
import type { NextPageWithLayout } from "@/pages/_app";

const StudentManualBookPage: NextPageWithLayout = () => {
  const { config, loading } = useSystemSetting();
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const openInNewTab = () => {
    if (!config.studentManualBookUrl) {
      toast.error("URL buku manual belum diatur oleh admin");
      return;
    }
    window.open(config.studentManualBookUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!config.studentManualBookUrl) {
    return (
      <>
        <Head>
          <title>Buku Manual | Mudah belajar ilmu shorof</title>
        </Head>
        <div className="w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold">Buku Manual</h1>
          </div>
          <div className="p-8 text-center border rounded-lg bg-white">
            <p className="mb-4 text-lg">Buku manual belum tersedia.</p>
            <p className="mb-6">
              Silakan hubungi admin untuk mengatur URL buku manual.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Buku Manual | Mudah belajar ilmu shorof</title>
      </Head>
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Buku Manual</h1>
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
            src={config.studentManualBookUrl}
            className="w-full h-full border rounded-lg bg-white"
            onLoad={() => setIsIframeLoading(false)}
            title="Student Manual Book"
            allow="fullscreen"
          />
        </div>
      </div>
    </>
  );
};

StudentManualBookPage.getLayout = (page) => {
  return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default StudentManualBookPage;