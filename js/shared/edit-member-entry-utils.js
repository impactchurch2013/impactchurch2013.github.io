export function selectMemberForEditFlow(members, memberId, openEditMemberFn, onMissingMemberFn){
  const member = members.find(m => m.id === memberId);
  if(!member){
    if(onMissingMemberFn){
      onMissingMemberFn();
    }
    return;
  }

  openEditMemberFn(member);
}

export function buildEditMemberEntryContext(member, escapeHtmlFn){
  const fields = member.fields || {};
  const valueForField = (key) => escapeHtmlFn(String(fields[key] || ""));
  const currentPhoto = String(fields.Photo || "").trim();
  const showCurrentPhoto = currentPhoto && !currentPhoto.startsWith("images/default");

  return {
    fields,
    valueForField,
    currentPhoto,
    showCurrentPhoto
  };
}

export function attachEditMemberRemovePhotoHandler(
  documentObj,
  setRemovePhotoFn,
  setPhotoBlobFn
){
  const removeBtn = documentObj.getElementById("editMemberRemovePhotoBtn");
  if(!removeBtn){
    return;
  }

  removeBtn.onclick = () => {
    setRemovePhotoFn(true);
    setPhotoBlobFn(null);

    const input = documentObj.getElementById("editMemberPhoto");
    if(input){
      input.value = "";
    }

    const newPreview = documentObj.getElementById("editMemberPhotoNewPreview");
    const newImage = documentObj.getElementById("editMemberPhotoNewPreviewImg");
    if(newImage && newImage.dataset.objectUrl){
      URL.revokeObjectURL(newImage.dataset.objectUrl);
      delete newImage.dataset.objectUrl;
    }
    if(newPreview){
      newPreview.style.display = "none";
    }
    if(newImage){
      newImage.removeAttribute("src");
    }

    const currentWrap = documentObj.getElementById("editMemberCurrentPhotoWrap");
    if(currentWrap){
      currentWrap.style.display = "none";
    }

    const removedNote = documentObj.getElementById("editMemberPhotoRemovedNote");
    if(removedNote){
      removedNote.style.display = "block";
    }
  };
}

export function applyEditMemberMinistrySelection(
  documentObj,
  ministryStringToSelectValueFn,
  ministryValue
){
  const select = documentObj.getElementById("editMinistry");
  if(!select){
    return;
  }

  select.value = ministryStringToSelectValueFn(ministryValue || "");
}

export function attachEditMemberPhotoInputChangeHandler(documentObj, onPhotoInputChangeFn){
  const photoInput = documentObj.getElementById("editMemberPhoto");
  if(!photoInput){
    return;
  }

  photoInput.addEventListener("change", onPhotoInputChangeFn);
}

export function attachEditMemberDeleteButtonHandler(documentObj, onDeleteMemberFn){
  const deleteButton = documentObj.getElementById("editDeleteMemberBtn");
  if(!deleteButton){
    return;
  }

  deleteButton.onclick = onDeleteMemberFn;
}

export function buildEditMemberModeHintHtml(isChurchAdmin){
  const message = isChurchAdmin
    ? "Update any profile fields. Changes save directly to the directory."
    : "Changes are sent for admin approval before they appear in the directory.";
  return `<p style="margin:0 0 8px;font-size:14px;color:#555;">${message}</p>`;
}

export function buildEditMemberCurrentPhotoHtml(showCurrentPhoto, currentPhoto, escapeHtmlFn){
  if(!showCurrentPhoto){
    return `<div id="editMemberCurrentPhotoWrap" style="display:none;"></div>`;
  }

  return `
        <div id="editMemberCurrentPhotoWrap" style="text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#666;">Current photo</p>
          <img id="editMemberCurrentPhotoImg" src="${escapeHtmlFn(currentPhoto)}" alt="" loading="lazy"
            style="max-width:100%;max-height:200px;border-radius:8px;border:1px solid #ddd;object-fit:contain;background:#fafafa;">
        </div>`;
}

export function buildEditMemberPhotoSectionHtml(showCurrentPhoto, currentPhoto, escapeHtmlFn){
  const currentPhotoHtml = buildEditMemberCurrentPhotoHtml(showCurrentPhoto, currentPhoto, escapeHtmlFn);

  return `
      <div style="display:flex;flex-direction:column;gap:6px;font-size:13px;">
        <span><strong>Profile photo</strong></span>
        ${currentPhotoHtml}
        <input id="editMemberPhoto" type="file" accept="image/*" style="font-size:14px;">
        <span style="font-size:12px;color:#666;">Up to 10 MB. Images are resized (max width 800px), converted to JPEG, and compressed before upload.</span>
        <button type="button" id="editMemberRemovePhotoBtn" style="align-self:flex-start;padding:8px 12px;border:1px solid #ccc;background:#fff;border-radius:8px;cursor:pointer;font-size:13px;">
          Remove photo
        </button>
        <p id="editMemberPhotoRemovedNote" style="display:none;margin:0;font-size:13px;color:#a32;">Photo will be removed when you save.</p>
        <div id="editMemberPhotoNewPreview" style="display:none;margin-top:4px;">
          <p style="margin:0 0 6px;font-size:13px;font-weight:600;">Preview (new photo)</p>
          <img id="editMemberPhotoNewPreviewImg" alt="" width="400" height="300" loading="lazy"
            style="max-width:100%;max-height:240px;border-radius:8px;border:1px solid #ddd;object-fit:contain;background:#fafafa;">
        </div>
      </div>`;
}

export function buildEditMemberDeleteButtonHtml(isChurchAdmin){
  if(!isChurchAdmin){
    return "";
  }

  return `
      <button type="button" id="editDeleteMemberBtn"
        style="margin-top:6px;padding:10px;border:1px solid #d4a0a0;color:#a32;background:#fff8f8;border-radius:8px;cursor:pointer;width:100%;">
        Remove from directory
      </button>
      `;
}
