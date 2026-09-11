using UnityEngine;
using TMPro;

public class TombstoneSetupManager : MonoBehaviour
{
    [Header("UI Elements")]
    public TMP_InputField nameInput;
    public TMP_InputField dateInput;
    public TMP_InputField quoteInput;

    public GameObject inputPanel;
    public GameObject modelSelectionPanel;
    public GameObject materialSelectionPanel;

    [Header("Tombstone Models")]
    public GameObject crossModel;
    public GameObject slabModel;
    public GameObject rectangleModel;
    public GameObject roundModel;

    private TextMeshPro nameTMP, dateTMP, quoteTMP;
    private Renderer currentRenderer;

    void Start()
    {
        // Warn if input fields are not assigned
        if (!nameInput || !dateInput || !quoteInput)
            Debug.LogWarning("⚠ One or more TMP_InputFields are not assigned in the Inspector.");

        // Hide selection panels initially
        modelSelectionPanel.SetActive(false);
        materialSelectionPanel.SetActive(false);
    }

    public void OnSubmitTextFields()
    {
        inputPanel.SetActive(false);
        modelSelectionPanel.SetActive(true);
    }

    public void OnModelSelected(string modelType)
    {
        DeactivateAllModels();

        switch (modelType)
        {
            case "Cross":
                ActivateModel(crossModel);
                break;
            case "Slab":
                ActivateModel(slabModel);
                break;
            case "Rectangle":
                ActivateModel(rectangleModel);
                break;
            case "Round":
                ActivateModel(roundModel);
                break;
        }

        ApplyInputToModel();
    }

    void DeactivateAllModels()
    {
        crossModel.SetActive(false);
        slabModel.SetActive(false);
        rectangleModel.SetActive(false);
        roundModel.SetActive(false);
    }

    void ActivateModel(GameObject model)
    {
        model.SetActive(true);
        nameTMP = model.transform.Find("NameText")?.GetComponent<TextMeshPro>();
        dateTMP = model.transform.Find("DateText")?.GetComponent<TextMeshPro>();
        quoteTMP = model.transform.Find("QuoteText")?.GetComponent<TextMeshPro>();
        currentRenderer = model.GetComponent<Renderer>();
    }

    void ApplyInputToModel()
    {
        if (nameTMP != null)
        {
            nameTMP.text = nameInput.text;
            nameTMP.gameObject.SetActive(true);
            nameTMP.ForceMeshUpdate();
        }

        if (dateTMP != null)
        {
            dateTMP.text = dateInput.text;
            dateTMP.gameObject.SetActive(true);
            dateTMP.ForceMeshUpdate();
        }

        if (quoteTMP != null)
        {
            quoteTMP.text = string.IsNullOrEmpty(quoteInput.text) ? "" : $"\"{quoteInput.text}\"";
            quoteTMP.gameObject.SetActive(true);
            quoteTMP.ForceMeshUpdate();
        }
    }

    public void OnNextButtonPressed()
    {
        modelSelectionPanel.SetActive(false);
        materialSelectionPanel.SetActive(true);
    }

    public void OnMaterialSelected(Material selectedMat)
    {
        if (currentRenderer != null)
        {
            currentRenderer.material = selectedMat;
        }
    }

    public void OnDoneButtonPressed()
    {
        PlayerPrefs.SetString("TombstoneModel", currentRenderer?.gameObject.name ?? "UnknownModel");
        PlayerPrefs.SetString("Material", currentRenderer?.material?.name ?? "UnknownMaterial");
        PlayerPrefs.SetString("Name", nameInput.text);
        PlayerPrefs.SetString("Date", dateInput.text);
        PlayerPrefs.SetString("Quote", quoteInput.text);
        PlayerPrefs.Save();

        Debug.Log("✅ Tombstone setup saved successfully!");
    }
}
