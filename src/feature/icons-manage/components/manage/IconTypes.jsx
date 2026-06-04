"use client";
import React, { useState } from "react";
import CustomIconButton from "@/components/shared/IconButton";
import { Stack, Typography, useTheme } from "@mui/material";
import { Plus } from "phosphor-react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { PencilSimple, Trash } from "phosphor-react";
import CustomCheckbox from "@/components/shared/CustomCheckbox";
import { AddOrEditCategoryModal } from "./Categories";
import useIconTypes from "../../hooks/manage/useIconTypes";
import DeleteConfirmationModal from "@/components/shared/DeleteConfirmationModal";

function IconTypesTable({ iconTypesHook }) {
  const {
    iconTypes,
    selectedIconTypes,
    handleSelectAll,
    removeIconType,
    handleIconTypeSelection,
    handleDeleteSelectedIconTypes,
    openModal,
    setOpenModal,
    editIconType,
    setIconTypeName,
    setCurrentEditIconType,
  } = iconTypesHook;
  const theme = useTheme();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedIconTypeIdForDelete, setSelectedIconTypeIdForDelete] =
    useState(null);

  const handleDeleteIconType = () => {
    removeIconType(selectedIconTypeIdForDelete);
    setOpenDeleteModal(false);
  };

  return (
    <>
      <MultipleSelectActions iconTypesHook={iconTypesHook} />
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="icon table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <CustomCheckbox
                  checked={selectedIconTypes.length === iconTypes.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  indeterminate={
                    selectedIconTypes.length > 0 &&
                    selectedIconTypes.length < iconTypes.length
                  }
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Icons count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {iconTypes.map((iconType, index) => (
              <TableRow key={index} hover>
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    checked={selectedIconTypes.includes(iconType.id)}
                    onChange={(e) =>
                      handleIconTypeSelection(iconType.id, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell>{iconType.name}</TableCell>
                <TableCell>{iconType.count}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => {
                      setOpenModal({ open: true, mode: "edit" });
                      setIconTypeName(iconType.name);
                      setCurrentEditIconType(iconType.id);
                    }}
                  >
                    <PencilSimple
                      size={20}
                      color={theme.palette.action.active}
                    />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setSelectedIconTypeIdForDelete(iconType.id);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <Trash size={20} color={theme.palette.action.active} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteIconType}
        itemCount={selectedIconTypes.length}
        itemName="icon type"
        itemPluralName="icon types"
      />
    </>
  );
}

function MultipleSelectActions({ iconTypesHook }) {
  const { selectedIconTypes, handleDeleteSelectedIconTypes } = iconTypesHook;
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleDeleteIconTypes = (iconIds) => {
    handleDeleteSelectedIconTypes(iconIds);
    setOpenDeleteModal(false);
  };

  if (selectedIconTypes.length === 0) {
    return null;
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      flexWrap="wrap"
      useFlexGap
      justifyContent={"space-between"}
      alignItems="center"
    >
      <Typography>{selectedIconTypes.length} selected</Typography>
      <CustomIconButton
        text="Delete"
        onClick={() => setOpenDeleteModal(true)}
        Icon={Trash}
        startIcon
        variant="destructive"
      />
      <DeleteConfirmationModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteIconTypes}
        itemCount={selectedIconTypes.length}
        itemName="icon type"
        itemPluralName="icon types"
      />
    </Stack>
  );
}

function IconTypes() {
  const iconTypesHook = useIconTypes();
  const {
    iconTypes,
    iconTypeName,
    setIconTypeName,
    openModal,
    setOpenModal,
    addNewIconType,
    editIconType,
  } = iconTypesHook;

  return (
    <Stack spacing="16px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h6"
          fontWeight={600}
          fontSize={"20px"}
          color="text.body"
        >
          {iconTypes.length} Results
        </Typography>
        <CustomIconButton
          text="Add Icon Type"
          Icon={Plus}
          startIcon
          onClick={() => {
            setIconTypeName("");
            setOpenModal({
              open: true,
              mode: "add",
            });
          }}
        />
      </Stack>
      <IconTypesTable iconTypesHook={iconTypesHook} />
      <AddOrEditCategoryModal
        open={openModal.open}
        onClose={() => setOpenModal((prev) => ({ ...prev, open: false }))}
        value={iconTypeName}
        setValue={setIconTypeName}
        onSubmit={openModal.mode === "add" ? addNewIconType : editIconType}
        type={"iconType"}
        mode={openModal.mode}
      />
    </Stack>
  );
}

export default IconTypes;
