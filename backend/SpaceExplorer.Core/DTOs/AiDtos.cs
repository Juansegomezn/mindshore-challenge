namespace SpaceExplorer.Core.DTOs
{
    public record AiEnrichmentResultDto(
        string ContextoHistorico,
        string DatoCurioso
    );

    public record ImageComparisonRequest(
        string ImageUrl1,
        string Title1,
        string ImageUrl2,
        string Title2
    );

    public record ImageComparisonResponse(
        string AnalisisSideBySide,
        string ElementosComunes,
        string DiferenciasClave,
        string ConclusionCientifica
    );
}